import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { Subcategory } from '@app/_shared/models/master-data/subcategory.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { ProductService } from '@app/_shared/services/product.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { environment } from '@environment/environment.development';

@Component({
  selector: 'app-edit-delete-product',
  templateUrl: './edit-delete-product.component.html',
  styleUrls: ['./edit-delete-product.component.scss'],
})
export class EditDeleteProductComponent implements OnInit {
  imageBaseUrl = environment.appUrl + '/uploads/';

  editProductForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  productId: number = 0;
  product!: Product;
  messages: string[] = [];
  editPage: boolean = true;
  colorButton: string = '';
  productCategories: ProductCategory[] = [];
  selectedFile!: File;
  imageUrl: string = '';
  subcategories: Subcategory[] = [];

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productCategoryService: ProductCategoryService,
    private subcategoryService: SubcategoryService
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
  }

  ngOnInit(): void {
    this.initializeForm();

    this.getPageType();

    this.getProductCategories();
    this.getProductSubcategories()
  }

  // onChangePurchasePrice(event: any) {
  //   const input = parseFloat(event.target.value).toFixed(2);

  //   this.editProductForm.patchValue({ purchasePrice: input });
  // }

  // onChangeSalesPrice(event: any) {
  //   this._salesPrice = event.target.value;

  //   this._valueOnHand = Number(this._salesPrice) * Number(this._qtyInStock);
  //   const valueOnHand = parseFloat(this._valueOnHand.toString()).toFixed(2);
  //   const salesPrice = parseFloat(event.target.value).toFixed(2);
  //   this.editProductForm.patchValue({ valueOnHand: valueOnHand });
  //   this.editProductForm.patchValue({ salesPrice: salesPrice });
  // }

  // onChangeQtyInStock(event: any) {
  //   this._qtyInStock = event.target.value;

  //   this._valueOnHand = Number(this._salesPrice) * Number(this._qtyInStock);
  //   const valueOnHand = parseFloat(this._valueOnHand.toString()).toFixed(2);

  //   const qtyInStock = parseInt(event.target.value);
  //   this.editProductForm.patchValue({ qtyInStock: qtyInStock });
  //   this.editProductForm.patchValue({ valueOnHand: valueOnHand });
  // }

  onChangeImage(event: any) {
    this.product.imageFile = <File>event.target.files[0];
    this.editProductForm.patchValue({ imageFile: this.product.imageFile });
    this.editProductForm.patchValue({ imageName: this.product.imageFile.name });
  }

  buildForm() {
    this.editProductForm = this.formBuilder.group({
      id: [this.product.id],
      name: [this.product.name, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      imageName: [
          this.product.imageName,
        [Validators.required],
      ],
      productCategoryId: [
        this.product.productCategoryId,
        [Validators.required],
      ],
      subcategoryId: [
        this.product.subcategoryId,
        [Validators.required],
      ],
    });
    this.formControls = Object.keys(this.editProductForm.controls);
    this.imageUrl = this.imageBaseUrl + this.product.imageName;
    //false for delete page
    if (this.editPage == false) {
      this.editProductForm.get('name')?.disable();
      this.editProductForm.get('description')?.disable();
      this.editProductForm.get('imageName')?.disable();
      this.editProductForm.get('productCategoryId')?.disable();
      this.editProductForm.get('subcategoryId')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editProductForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editProductForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editProductForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editProductForm.value);

      if (this.editPage) {
        //Edit page
        debugger;
        var frmData = Object.assign(this.editProductForm.value);
        frmData.imageFile = this.product.imageFile;
        this.productService
          .updateProduct(this.editProductForm.value)
          .subscribe({
            next: (response: any) => {
              // debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully edited the product');
              this.router.navigateByUrl('/master-data/products');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.messages = error.error.errors;
              } else {
                this.messages.push(error.error);
              }
            },
          });
      }

      // Delete Page
      else {
        this.productService
          .deleteProduct(this.editProductForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.messages.push('Successfully deleted the product');
              this.router.navigateByUrl('/master-data/products');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.messages = error.error.errors;
              } else {
                this.messages.push(error.error);
              }
            },
          });
      }
    }
  }

  initializeForm() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.productId = Number(paramMap.get('id'));
      this.productService.getProduct(this.productId).subscribe({
        next: (response: any) => {
          this.product = response.result;
          // this._salesPrice = this.product.salesPrice;
          // this._qtyInStock = this.product.qtyInStock;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }

  getProductCategories() {
    this.productCategoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.productCategories = response.result;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
    });
  }

  getProductSubcategories(){
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (response: any) => {
        this.subcategories = response.result;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
    })
  }

  getPageType() {
    let title = this.activatedRoute.snapshot.data['title'];
    // debugger;
    if (title == 'Delete Product') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }
}
